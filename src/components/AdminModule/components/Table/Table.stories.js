import React from "react";
import { action } from "@storybook/addon-actions";
import Table from "./Table";

export default {
  title: "Table",
  component: Table,
  argTypes: {
    headers: {
      description: 'Header for table - array of objects with key & label'
    },
    data: {
      description: 'Each row data - array of objects with data'
    },
    isLoading: {
      description: 'To enable loading state for the component'
    }
  }
};

const dummyData = [
  {
    id: 1,
    name: "Nithi",
    email: "testemail@gmail.com",
  },
  {
    id: 2,
    name: "John",
    email: "johntest@gmail.com",
  },
  {
    id: 3,
    name: "Doe",
    email: "Doe@gmail.com",
  },
  {
    id: 4,
    name: "Meclan",
    email: "meclantest@gmail.com",
  },
];

const dummyHeaders = [
  {
    label: "ID",
    key: "id",
  },
  {
    label: "Name",
    key: "name",
  },
  {
    label: "Email",
    key: "email",
  },
];

const dummyHeaderWithAction = [
  ...dummyHeaders,
  {
    label: "Action",
    key: "action",
  },
];

// export const WithData = () => (
//   <Table headers={dummyHeaders} data={dummyData}></Table>
// );

// export const loading = () => (
//   <Table headers={dummyHeaders} isLoading={true}></Table>
// );

// export const WithActions = () => (
//   <Table headers={dummyHeaderWithAction} data={dummyData}></Table>
// );

export const WithData = Table.bind({});
WithData.args = {
  headers: dummyHeaders,
  data: dummyData,
};

export const Loading = Table.bind({});
Loading.args = {
  headers: dummyHeaders,
  data: dummyData,
  isLoading: true,
};

export const WithActions = Table.bind({});
WithActions.args = {
  headers: dummyHeaderWithAction,
  data: dummyData,
  // editLink: action("Edit icon Clicked"),
  // handleDelete: action("Delete icon clicked"),
};
