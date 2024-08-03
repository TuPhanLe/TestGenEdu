"use client";
import { useTheme } from "next-themes";
import React from "react";
import D3WordCloud from "react-d3-cloud";
type Props = {};
const data = [
  {
    text: "Le Dong Khoa",
    value: 3,
  },
  {
    text: "Tran Minh Tri",
    value: 13,
  },
  {
    text: "Phan Le Tuan Tu",
    value: 4,
  },
  {
    text: "Luong Cong Khanh",
    value: 7,
  },
  {
    text: "OPDA-ODMO",
    value: 4,
  },
  {
    text: "Ha Phuc Hao",
    value: 2,
  },
  {
    text: "Bui Thanh Tinh",
    value: 23,
  },
  {
    text: "Mr. Nguyen Dinh Long",
    value: 11,
  },
];

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 10 + 16;
};
const CustomWordCloud = (props: Props) => {
  const theme = useTheme();
  return (
    <>
      <D3WordCloud
        height={550}
        data={data}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme == "dark" ? "white" : "black"}
      ></D3WordCloud>
    </>
  );
};

export default CustomWordCloud;
