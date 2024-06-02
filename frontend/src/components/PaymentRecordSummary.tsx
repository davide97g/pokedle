import { Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react";
import { PaymentRecord } from "../../../types/user.types";
import dayjs from "dayjs";

export const PaymentRecordSummary = ({ item }: { item: PaymentRecord }) => {
  return (
    <Card>
      <CardHeader className="flex gap-3 text-left">
        <div className="flex flex-col">
          <p className="text-md">Product</p>
          <p className="text-small text-default-500">{item.product}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-row items-center gap-4">
          <Chip className="text-sm" size="sm">
            {dayjs(item.date).format("ddd MM YYYY - HH:mm:ss")}
          </Chip>

          <Chip
            className="text-sm cursor-pointer"
            size="sm"
            variant="solid"
            color="primary"
          >
            {item.amount / 100}€
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
};
