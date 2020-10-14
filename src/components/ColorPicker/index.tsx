import React, { useState, useRef } from "react";

import { ReactComponent as ArrowIcon } from "../../icons/arrow-down.svg";
import styles from "./colorPicker.module.css";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import Slider from "../Slider";

import { hexToRgb, rgbToHex } from "./functions";

type RgbType = {
  r: number;
  g: number;
  b: number;
};

type SlidersDropdownProps = {
  close: () => void;
  onChange: (obj: RgbType) => void;
  onOk: (obj: RgbType) => void;
  onCancel: () => void;
  value: { r: number; g: number; b: number };
};

const SlidersDropdown: React.FC<SlidersDropdownProps> = ({
  close,
  onChange,
  onOk,
  onCancel,
  value,
}) => {
  const [rgb, setRgb] = useState(value);

  const slidersRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(slidersRef, close);

  const onSliderChange = ({
    id,
    val,
  }: {
    id: "r" | "g" | "b";
    val: number;
  }) => {
    setRgb((state) => ({ ...state, [id]: val }));
    onChange({ ...rgb, [id]: val });
  };

  return (
    <div ref={slidersRef} className={styles.slidersPanel}>
      <div className={styles.slidersItem}>
        <div style={{ userSelect: "none" }}>r</div>
        <div style={{ flex: "1 1", marginLeft: 8 }}>
          <Slider
            value={value.r}
            max={255}
            onChange={(val: number) => onSliderChange({ val, id: "r" })}
            style={{ background: "red" }}
          />
        </div>
      </div>

      <div className={styles.slidersItem}>
        <div style={{ userSelect: "none" }}>g</div>
        <div style={{ flex: "1 1", marginLeft: 8 }}>
          <Slider
            value={value.g}
            max={255}
            onChange={(val: number) => onSliderChange({ val, id: "g" })}
            style={{ background: "green" }}
          />
        </div>
      </div>

      <div className={styles.slidersItem}>
        <div style={{ userSelect: "none" }}>b</div>
        <div style={{ flex: "1 1", marginLeft: 8 }}>
          <Slider
            value={value.b}
            max={255}
            onChange={(val: number) => onSliderChange({ val, id: "b" })}
            style={{ background: "blue" }}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={() => onOk(rgb)}>Ok</button>
      </div>
    </div>
  );
};

type ColorsDropdownProps = {
  close: () => void;
  onColorChange: (color: string) => void;
  colors: Array<string>;
  value: string;
};

const ColorsDropdown: React.FC<ColorsDropdownProps> = ({
  close,
  onColorChange,
  colors,
  value,
}) => {
  const colorsRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(colorsRef, close);

  return (
    <div ref={colorsRef} className={styles.colorsPanel}>
      {colors.map((color) => (
        <div
          className={`${styles.colorItem} ${
            value === color ? styles.active : ""
          }`}
          key={color}
          onClick={() => onColorChange(color)}
        >
          <div>{color}</div>
          <div style={{ width: 24, height: 24, background: color }}></div>
        </div>
      ))}
    </div>
  );
};

type ColorPickerProps = {
  colors: string[];
  onChange: (color: string) => void;
  value: string;
};
const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  onChange,
  value,
}) => {
  const [color, setColor] = useState(() => hexToRgb(value));
  const [slidersValue, setSlidersValue] = useState(() => hexToRgb(value));

  const [slidersPanelIsOpen, setSlidersPanelIsOpen] = useState(false);
  const [colorsPanelIsOpen, setColorsPanelIsOpen] = useState(false);

  const handleSlidersBtnClick = () => {
    setSlidersPanelIsOpen(true);
  };

  const handleColorsBtnClick = () => {
    setColorsPanelIsOpen(true);
  };

  const handleColorChange = (color: string) => {
    const rgb = hexToRgb(color);
    setSlidersValue(rgb);
    setColor(rgb);
    setColorsPanelIsOpen(false);
    onChange && onChange(color);
  };

  const handleSlidersChange = (color: RgbType) => {
    setSlidersValue(color);
  };

  const handleOk = ({ r, g, b }: RgbType) => {
    setColor({ r, g, b });
    setSlidersValue({ r, g, b });
    onChange && onChange(rgbToHex(r, g, b));
    setSlidersPanelIsOpen(false);
  };

  const handleCancel = () => {
    setSlidersPanelIsOpen(false);
  };

  return (
    <div className={styles.root} style={{ marginTop: 100 }}>
      <div className={styles.field}>
        {color && rgbToHex(color.r, color.g, color.b)}
      </div>
      <div className={styles.slidersBtn} onClick={handleSlidersBtnClick}>
        <div
          style={{
            width: 24,
            height: 24,
            backgroundColor: slidersValue
              ? `rgb(${slidersValue.r},${slidersValue.g},${slidersValue.b})`
              : "#fff",
          }}
        ></div>
      </div>
      <div className={styles.colorsBtn} onClick={handleColorsBtnClick}>
        <ArrowIcon />
      </div>
      {slidersPanelIsOpen && (
        <SlidersDropdown
          value={color!}
          close={() => setSlidersPanelIsOpen(false)}
          onChange={handleSlidersChange}
          onOk={handleOk}
          onCancel={handleCancel}
        />
      )}
      {colorsPanelIsOpen && (
        <ColorsDropdown
          value={rgbToHex(color!.r, color!.g, color!.b)}
          close={() => setColorsPanelIsOpen(false)}
          colors={colors}
          onColorChange={handleColorChange}
        />
      )}
    </div>
  );
};

export default ColorPicker;
