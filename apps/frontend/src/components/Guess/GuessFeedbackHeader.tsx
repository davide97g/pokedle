import { Card, CardBody } from "@heroui/card";
import { useLayout } from "../../hooks/useLayout";

export const GuessFeedbackHeader = () => {
  const { isMobile } = useLayout();
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-24 sm:h-12">
          <p className="text-xs text-white/90">Pokemon</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Type 1</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Type 2</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Habitat</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Color</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Stage</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Height</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Weight</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">
            {isMobile ? "Gen" : "Generation"}
          </p>
        </CardBody>
      </Card>
    </div>
  );
};
