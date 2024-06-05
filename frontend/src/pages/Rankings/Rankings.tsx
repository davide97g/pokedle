import { Tab, Tabs } from "@nextui-org/react";
import { lazy, Suspense } from "react";
import { Loader } from "../../components/Loader";

const TopPlayers = lazy(() => import("./TopPlayers"));
const BestStreak = lazy(() => import("./BestStreak"));
const DailyBest = lazy(() => import("./DailyBest"));

export function Rankings() {
  return (
    <div className="flex flex-col justify-center items-center gap-10 px-10">
      <div className="pt-5 md:pt-10 flex flex-row items-center">
        <h1 className="text-2xl">Rankings</h1>
      </div>
      <div className="flex w-full flex-col">
        <Tabs color="primary" radius="full">
          <Tab key="top-players" title="Top Players">
            <Suspense fallback={<Loader />}>
              <TopPlayers />
            </Suspense>
          </Tab>
          <Tab key="best-streak" title="Best Streak">
            <Suspense fallback={<Loader />}>
              <BestStreak />
            </Suspense>
          </Tab>
          <Tab key="daily-best" title="Daily Best">
            <Suspense fallback={<Loader />}>
              <DailyBest />
            </Suspense>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
