"use client";

import RankStoreCard from "@/app/components/RankStoreCard";
import { getStoreRankCards } from "@/data/monthly-ranks";

export default function RankGrid() {
  const monthlyRanks = getStoreRankCards();

  return (
    <div className="mb-32 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
      {monthlyRanks.map((rank) => (
        <RankStoreCard key={rank.id} rank={rank} />
      ))}
    </div>
  );
}
