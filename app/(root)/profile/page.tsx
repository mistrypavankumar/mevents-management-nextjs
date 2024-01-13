import { Button } from "@/components/ui/button";
import Collection from "@/components/ui/shared/Collection";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

async function ProfilePage() {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;

  const organizedEvents = await getEventsByUser({ userId, page: 1 });

  return (
    <>
      {/* My Tickets   */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild size={"lg"} className="button hidden sm:flex">
            <Link href={"/#events"}>Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={[]}
          emptyTitle="No events tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exicting events to explore!"
          collectionType="My_Tickets"
          limit={3}
          page={1}
          totalPages={2}
          urlParamsName="ordersPage"
        />
      </section>

      {/* Events Organized   */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button size={"lg"} asChild className="button hidden sm:flex">
            <Link href={"/events/create"}>Create New Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now."
          collectionType="Events_Organized"
          limit={6}
          page={1}
          totalPages={2}
          urlParamsName="eventsPage"
        />
      </section>
    </>
  );
}

export default ProfilePage;
