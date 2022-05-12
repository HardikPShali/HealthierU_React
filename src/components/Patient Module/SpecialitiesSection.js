import React from 'react'
import home2 from '../../images/home-2.png'
import sleep from '../../images/svg/sleep-icon.svg'
import nutrient from '../../images/svg/nutrient-icon.svg'
import fitness from '../../images/svg/fitness-icon.svg'
import fertility from '../../images/svg/fertility-icon.svg'
import mentalHealth from '../../images/svg/mental-health-icon.svg'

import immunity from '../../images/svg/immunity-icon.svg'

const SpecialititesData = [
    {
        image: nutrient,
        name: 'Nutrition'
    },
    {
        image: sleep,
        name: 'Sleep'
    },
    {
        image: immunity,
        name: 'Immunity'
    },
    {
        image: fertility,
        name: 'Fertility'
    },
    {
        image: fitness,
        name: 'Fitness'
    },
    {
        image: mentalHealth,
        name: 'Mental Health'
    }
]


const SpecialitiesSection = () => {
    return (
        <div className='specialities'>
            <div className='container'>
                <h3 className='specialities-header'>Our Specialities</h3>
                <div className='row'>
                    {SpecialititesData.map((item, index) => {
                        return (
                            <div className='col-4 text-center' key={index}>
                                <div className='specialities-profile'>
                                    <img alt='speciality' className='speciality-icon' src={item.image} />
                                    <h6 className='speciality-name'>{item.name}</h6>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

export default SpecialitiesSection