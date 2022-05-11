import React from 'react'
import home2 from '../../images/home-2.png'

const SpecialititesData = [
    {
        image: home2,
        name: 'Nutrition'
    },
    {
        image: home2,
        name: 'Sleep'
    },
    {
        image: home2,
        name: 'Immunity'
    },
    {
        image: home2,
        name: 'Fertility'
    },
    {
        image: home2,
        name: 'Fitness'
    },
    {
        image: home2,
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