import React from "react";

const Activity = () => {
  return (
    <>
      <section className="mt-6">
        <h2 className="text-lg font-medium mb-3">Recent activity</h2>
        <div className="space-y-3">
          <ActivityItem
            who="Alice Johnson"
            what="approved time-off for Bob Smith"
            when="2 hours ago"
          />
          <ActivityItem
            who="System"
            what="monthly payroll processed"
            when="1 day ago"
          />
          <ActivityItem
            who="Grace Park"
            what="added candidate for Designer role"
            when="2 days ago"
          />
        </div>
      </section>
    </>
  );
};

export default Activity;

function ActivityItem({ who, what, when }) {
  return (
    <div className="p-3 bg-white dark:bg-gray-500 border rounded-md flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
        {who
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="text-sm">
        <div>
          <span className="font-medium">{who}</span>{" "}
          <span className="">{what}</span>
        </div>
        <div className="text-xs mt-1">{when}</div>
      </div>
    </div>
  );
}
