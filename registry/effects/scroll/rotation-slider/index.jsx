import { RotationSliderComp } from "./RotationSliderComp";

export default function RotationSlider() {
   const images = [
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg", text:"Initialize Motion Layer" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg", text:"Inject Depth Matrix" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg", text:"Sync Scroll Engine" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-04.jpg", text:"Calibrate Perspective" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg", text:"Activate 3D Pipeline" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-06.jpg", text:"Bind Interaction Core" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-07.jpg", text:"Compute Visual Flow" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-08.jpg", text:"Render Adaptive Frames" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-09.jpg", text:"Stabilize Motion Curve" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-10.jpg", text:"Optimize Transition Graph" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-01.jpg", text:"Deploy Experience Layer" },
 { src:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-02.jpg", text:"Finalize Hyperiux State" },
 ];

 return (
 <>
 <RotationSliderComp images={images} />
 </>
 );
}
