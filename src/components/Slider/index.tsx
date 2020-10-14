import React from "react";

import { getPercentage, getValue, getLeft } from "./functions";

import styles from "./slider.module.css";

type SliderFragmentProps = React.ComponentPropsWithoutRef<"div">;

const StyledSlider = React.forwardRef<HTMLDivElement, SliderFragmentProps>(
  ({ children, ...props }, ref): React.ReactElement => (
    <div ref={ref} className={styles.slider} {...props}>
      {children}
    </div>
  )
);

const StyledThumb = React.forwardRef<HTMLDivElement, SliderFragmentProps>(
  (props, ref): React.ReactElement => (
    <div ref={ref} className={styles.thumb} {...props}></div>
  )
);

type SliderProps = {
  value: number;
  max: number;
  formatFn?: (num: number) => number;
  onChange: (num: number) => void;
  [x: string]: any;
};

const Slider: React.FC<SliderProps> = ({
  value,
  max,
  formatFn = (number) => Math.round(number),
  onChange,
  ...other
}) => {
  const initialPercentage = getPercentage(value, max);

  const sliderRef = React.useRef<HTMLDivElement | null>(null);
  const thumbRef = React.useRef<HTMLDivElement | null>(null);

  const diff = React.useRef<number | null>(null);

  const handleThumb = (clientX: number) => {
    const diffValue = diff.current!;

    let newX =
      clientX - diffValue - sliderRef.current!.getBoundingClientRect().left;

    const end = sliderRef.current!.offsetWidth - thumbRef.current!.offsetWidth;

    const start = 0;

    if (newX < start) {
      newX = 0;
    }

    if (newX > end) {
      newX = end;
    }

    const newPercentage = getPercentage(newX, end);
    const newValue = getValue(newPercentage, max);

    thumbRef.current!.style.left = getLeft(newPercentage);

    onChange(formatFn(newValue));
  };

  const handleMouseMove = (event: any) => {
    handleThumb(event.clientX);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
  };

  const handleMouseDown: React.MouseEventHandler = (event) => {
    diff.current =
      event.clientX - thumbRef.current!.getBoundingClientRect().left;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleClick: React.MouseEventHandler = (event) => {
    handleThumb(event.clientX);
  };
  return (
    <>
      <StyledSlider ref={sliderRef} onClick={handleClick} {...other}>
        <StyledThumb
          style={{ left: getLeft(initialPercentage) }}
          ref={thumbRef}
          onMouseDown={handleMouseDown}
        />
      </StyledSlider>
    </>
  );
};

export default Slider;
