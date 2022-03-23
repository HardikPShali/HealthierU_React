import React from "react";
import Button from "./Button"

export default {
    title: 'Button',
    component: Button,
    argTypes: {
        btnText: {
            description: 'Text on the Button'
        },
    }
}
const dummyData = [
    {
        name: "A"
    },
    {
        name: "B"
    }
]

export const AddButton = Button.bind({});
AddButton.args = {
    btnText: dummyData,
    addLink: dummyData.name
}