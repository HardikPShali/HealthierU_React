import DeleteModal from "./DeleteModal";
import { action } from "@storybook/addon-actions";

export default {
    title: 'DeleteModal',
    component: DeleteModal,
    argTypes: {
        ModalTitle: {
            description: 'Title of the Modal'
        },
        ModalBody: {
            description: "Body of the Modal"
        },
        ModalFooter: {
            description: "Footer of the Modal"
        }
    }
}
const dummyData = [
    {
        Title: "Title1",
        Body: "Body1",
        Footer:"Footer1"
    },
    {
        name: "Title2",
        Body: "Body2",
        Footer:"Footer2"
    }
]

export const DeleteModal = DeleteModal.bind({});
DeleteModal.args = {
    ModalTitle: dummyData.Title,
    ModalBody: dummyData.Body,
    ModalFooter:dummyData.Footer,
    data: dummyData,
    handleDelete: action("Button Clicked")
};