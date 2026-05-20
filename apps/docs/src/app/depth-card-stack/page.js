import React from'react'
import CardCarousel from'@/components/Slider/CardsSlider'

const cards = [
 { name:"Hyperiux Core", num:"0772", joined:"Apr 20, 2026", color:"#41431B", claimedText:"Alexander claimed 2 hours ago", textureImage:"/assets/texture/texture-pattern03.png" },
 { name:"UI Flux Engine", num:"0771", joined:"Apr 20, 2026", color:"#C084FC", claimedText:"Travis claimed 5 hours ago", textureImage:"/assets/texture/texture-pattern02.png" },
 { name:"Neon Grid System", num:"0770", joined:"Apr 20, 2026", color:"#93C5FD", claimedText:"Kaiho claimed 9 hours ago", textureImage:"/assets/texture/texture-pattern03.png" },
 { name:"Glassmorph Lab", num:"0769", joined:"Apr 20, 2026", color:"#2C3947", claimedText:"Exo Des claimed 3 hours ago", textureImage:"/assets/texture/texture-pattern04.png" },
 { name:"Motion Kit Pro", num:"0768", joined:"Apr 20, 2026", color:"#3E2C23", claimedText:"Frank Lee claimed 1 hour ago", textureImage:"/assets/texture/texture-pattern.png" },

 { name:"Shadow Tokens", num:"0767", joined:"Apr 20, 2026", color:"#60A5FA", claimedText:"Alexander claimed 2 hours ago", textureImage:"/assets/texture/texture-pattern05.png" },
 { name:"Aurora Layout", num:"0766", joined:"Apr 20, 2026", color:"#FFB33F", claimedText:"Travis claimed 5 hours ago", textureImage:"/assets/texture/texture-pattern02.png" },
 { name:"Dark Pulse UI", num:"0765", joined:"Apr 20, 2026", color:"#111111", claimedText:"Kaiho claimed 9 hours ago", textureImage:"/assets/texture/texture-pattern.png" },
 { name:"Quantum Cards", num:"0764", joined:"Apr 20, 2026", color:"#A78BFA", claimedText:"Exo Des claimed 3 hours ago", textureImage:"/assets/texture/texture-pattern04.png" },
 { name:"Hype Components", num:"0763", joined:"Apr 20, 2026", color:"#F472B6", claimedText:"Frank Lee claimed 1 hour ago", textureImage:"/assets/texture/texture-pattern05.png" },
];

const page = () => {
 return (
 <div>
 <CardCarousel cards={cards} />
 </div>
 )
}

export default page
