import { Card, CardBody } from "@nextui-org/react";

export const GuessFeedbackHeader = () => {
  return (
    <div className="flex flex-row gap-2">
      <Card>
        <CardBody className="w-24 text-center flex flex-row justify-center items-center h-12">
          <p className="text-xs text-white/90">Pokemon</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="w-24 text-center flex flex-row justify-center items-center h-12">
          <p className="text-xs text-white/90">Type 1</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="w-24 text-center flex flex-row justify-center items-center h-12">
          <p className="text-xs text-white/90">Type 2</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="w-24 text-center flex flex-row justify-center items-center h-12">
          <p className="text-xs text-white/90">Habitat</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="w-24 text-center flex flex-row justify-center items-center h-12">
          <p className="text-xs text-white/90">Color</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="w-24 text-center flex flex-row justify-center items-center h-12">
          <p className="text-xs text-white/90">Evol. Stage</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="w-24 text-center flex flex-row justify-center items-center h-12">
          <p className="text-xs text-white/90">Height</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="w-24 text-center flex flex-row justify-center items-center h-12">
          <p className="text-xs text-white/90">Weight</p>
        </CardBody>
      </Card>
    </div>
  );
};
