import { Card, CardBody } from "@heroui/react";

import { ValidationComparison } from "@pokedle/types";
import { ComparisonIcon } from "../ComparisonIcon";
import "./animate.css";

export function GuessFeatureCard({
  valid = false,
  value,
  comparison,
  timeout,
}: Readonly<{
  valid?: boolean;
  value: string;
  comparison?: ValidationComparison;
  timeout?: number;
}>) {
  return (
    <Card
      className="fade-in"
      style={{ animationDelay: `${(timeout ?? 0) + 0.5}s` }}
    >
      <CardBody
        className={`overflow-hidden truncate sm:text-wrap w-24 ${
          valid ? "bg-emerald-500" : "bg-rose-800"
        }  text-center flex justify-center`}
      >
        <p className="sm:text-small text-xs capitalize">{value}</p>
      </CardBody>
      <ComparisonIcon comparison={comparison} />
    </Card>
  );
}
