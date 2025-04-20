import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import { CheckoutItem } from "../types/user.types";

export const CheckoutItemSummary = ({ item }: { item: CheckoutItem }) => {
  return (
    <Card>
      <CardHeader className="flex gap-3 text-left">
        <div className="flex flex-col">
          <p className="text-md">Product</p>
          <p className="text-small text-default-500">{item.description}</p>
          <Chip className="text-sm absolute top-2 right-2" size="sm">
            x {item.quantity}
          </Chip>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-row items-center gap-4">
          <Chip className="text-sm" size="sm">
            {item.date}
          </Chip>
          <Tooltip
            color="secondary"
            content={`Total = price ${item.price / 100}€ x ${item.quantity}`}
          >
            <Chip
              className="text-sm cursor-pointer"
              size="sm"
              variant="solid"
              color="primary"
            >
              {item.total / 100}€
            </Chip>
          </Tooltip>
        </div>
      </CardBody>
    </Card>
  );
};
