"use server";

import { CreateUserParams, UpdateUserParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";
import { revalidatePath } from "next/cache";
import Order from "../database/models/order.model";

export const createUser = async (user: CreateUserParams) => {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (err) {
    handleError(err);
  }
};

export const getUserById = async (userId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found.");
    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    handleError(err);
  }
};

export const updateUser = async (clerkId: string, user: UpdateUserParams) => {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (err) {
    handleError(err);
  }
};

export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDatabase();

    // find the user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) throw new Error("User not found");

    // unlink relationship
    await Promise.all([
      // update the 'events' collection to remove references to the user
      Event.updateMany(
        {
          _id: { $in: userToDelete.events },
        },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    const deleteUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deleteUser ? JSON.parse(JSON.stringify(userToDelete._id)) : null;
  } catch (err) {
    handleError(err);
  }
};
