import PiechartTransition from'@/components/showcase/transitions/PieChart/PiechartTransition'
import PieChartHeader from'@/components/showcase/transitions/PieChart/PieChartHeader'
import React from'react'

export default function layout({ children }) {
 return (
 <PiechartTransition>
 <PieChartHeader />
 {children}
 </PiechartTransition>
 )
}
