import { ISettingsPointer, RoundSlider } from "mz-react-round-slider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ComponentProps {
  rangevalue: number;
  checked: boolean;
  setvalue: Dispatch<SetStateAction<number>>;
}

const Component: React.FC<ComponentProps> = ({
  rangevalue,
  setvalue,
  checked,
}) => {
  console.log("Şu anki değer: " + rangevalue);

  // pointers state'ini tanımlıyoruz
  const [pointers, setPointers] = useState<ISettingsPointer[]>([
    { value: rangevalue }, // Başlangıç değeri olarak rangevalue kullanıyoruz
  ]);

  // İlk render sırasında pointers'ı rangevalue ile eşitle

  // onChange handler'ını tanımlıyoruz
  const handlePointerChange = (newPointers: ISettingsPointer[]) => {
    // Slider'ın ibresini güncelliyoruz
    const newValue =
      typeof newPointers[0]?.value === "number" ? newPointers[0].value : 20;
    // pointers'ı sadece newPointers ile güncelle
    setPointers(newPointers);

    console.log("Yeni değer: " + newValue);
    setvalue(newValue); // Burada setvalue çağrısını yapıyoruz
  };

  // rangevalue değiştiğinde pointers'ı güncelle
  useEffect(() => {
    // Eğer rangevalue değişirse, sadece pointers'ı güncelle
    setPointers((prevPointers) => [{ value: rangevalue }]);
  }, [rangevalue]);

  console.log("Şu anki değer1: " + rangevalue);
  console.log("Şu anki değer poin: " + pointers[0].value);
  return (
    <RoundSlider
      disabled={!checked}
      pointers={pointers}
      onChange={handlePointerChange}
      SvgDefs={
        <>
          <linearGradient
            id="color-slider-gradient"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={`hsl(${
                120 -
                120 *
                  ((typeof pointers[0].value === "number"
                    ? pointers[0].value
                    : 0) /
                    100)
              }, 100%, 40%)`} // Yeşilden kırmızıya geçiş
            />
            <stop
              offset="100%"
              stopColor={`hsl(${
                120 -
                120 *
                  ((typeof pointers[0].value === "number"
                    ? pointers[0].value
                    : 0) /
                    100)
              }, 50%, 20%)`} // Daha koyu geçiş
            />
          </linearGradient>
        </>
      }
      animateOnClick={true}
      pathStartAngle={150}
      pathEndAngle={30}
      pathBgColor={"#d0d0d"}
      pathThickness={5}
      pathInnerBgColor={"url(#color-slider-gradient)"}
      pathInnerBgFull={false}
      connectionBgColor={"#939191"}
      pointerBgColor={"#cbcbcb"}
      pointerBgColorSelected={"#d7d7d7"}
      pointerRadius={20}
      enableTicks={true}
      ticksCount={36}
      ticksGroupSize={3}
      ticksDistanceToPanel={5}
      tickValuesPrefix={" "}
      tickValuesSuffix={"°"}
      tickValuesDistance={20}
      tickValuesColor={"#e1e1e1"}
      textColor={"#fff"}
      textFontSize={24}
      textSuffix={"°"}
      textPrefix={" "}
      min={0}
      max={100}
    />
  );
};

export default Component;
