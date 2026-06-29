import React from 'react'
import Return from '../Components/Return'
import Header from '../../../layouts/Topbar'
const Courier_Partner = () => {
  return (
    <>
    <Header />
    <Return />
    <div className="p-6 bg-yellow-100 text-foreground rounded-lg shadow-md max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
    <h2 className="text-xl font-semibold mb-4">Customer Return Courier Partner Preference</h2>
    <ul className="list-disc list-inside mb-4 space-y-2">
        <li>Decide the courier partner based on the details given below in the table.</li>
        <li>Use set preference to define your sequence of preferred courier partners.</li>
        <li>Returns will be done using your defined preferred courier partner from this list, depending on their availability and capacity determined by Trialshopy.</li>
    </ul>
    
    </div>
    <div>
    
    <div className="text-center mb-4">
    <p className="mb-4">
        To know more visit: <a href="#" className="text-primary hover:underline">FAQs</a>
    </p>
        <p className="text-muted-foreground">We are having trouble showing this undefined at the moment.</p>
        <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 mt-2 p-2 rounded-md text-sm">Retry</button>
    </div>
    <div className="flex justify-center">
        <img 
            alt="Trialshopy promotional video" 
            src="https://openui.fly.dev/openui/100x100.svg?text=💸" 
            className="rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        />
    </div>
</div></>
  )
}

export default Courier_Partner