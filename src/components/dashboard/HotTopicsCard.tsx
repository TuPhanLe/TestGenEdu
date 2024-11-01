import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CustomWordCloud from "../CustomWordCloud";

type Props = {};

const HotTopicsCard = (props: Props) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it!
          <CustomWordCloud></CustomWordCloud>
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2"></CardContent>
    </Card>
  );
};

export default HotTopicsCard;
