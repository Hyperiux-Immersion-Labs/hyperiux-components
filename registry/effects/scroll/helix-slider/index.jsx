import HelixScrollComp from "./HelixSliderComp";

const cards = [
 { id: 1, image:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg", title:"Card 1" },
 { id: 2, image:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg", title:"Card 2" },
 { id: 3, image:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg", title:"Card 3" },
 { id: 4, image:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-04.jpg", title:"Card 4" },
 { id: 5, image:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg", title:"Card 5" },
 { id: 6, image:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-06.jpg", title:"Card 6" },
];

export default function HelixSlider() {
 return (
    <>
 <main>
 <HelixScrollComp
 items={cards}
 cardWidth={210}
 cardHeight={290}
 verticalSpacing={105}
 snakeAmplitude={340}
 snakeTightness={1}
 depthAmplitude={200}
 scrollDistance={360}
 perspective={1900}
 scaleMin={0.72}
 yRotateStrength={1.0}
 zRotateStrength={0.0}
 maxYRotation={0}
 maxZRotation={0}
 />
 </main>
  </>
 );
}
