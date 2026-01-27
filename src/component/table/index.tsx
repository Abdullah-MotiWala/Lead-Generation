// import React from 'react';
// import {Table} from 'antd';
// import type { TableProps } from 'antd';

// interface DataType {
//   key: string;
//   name: string;
//   age: number;
//   address: string;
//   tags: string[];
// }

// const columns: TableProps<DataType>['columns'] = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name',
//     render: (text:string) => <a>{text}</a>,
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//     key: 'age',
//   },
//   {
//     title: 'Address',
//     dataIndex: 'address',
//     key: 'address',
//   },
//   {
//     title: 'Tags',
//     key: 'tags',
//     dataIndex: 'tags',
//     // render: ({ tags }) => (
//     //   <Flex gap="small" align="center" wrap>
//     //     {tags.map((tag:any) => {
//     //       let color = tag.length > 5 ? 'geekblue' : 'green';
//     //       if (tag === 'loser') {
//     //         color = 'volcano';
//     //       }
//     //       return (
//     //         <Tag color={color} key={tag}>
//     //           {tag.toUpperCase()}
//     //         </Tag>
//     //       );
//     //     })}
//     //   </Flex>
//     // ),
//   },
//   {
//     title: 'Action',
//     key: 'action',
//     // render: (_, record) => (
//     //   <Space size="middle">
//     //     <a>Invite {record.name}</a>
//     //     <a>Delete</a>
//     //   </Space>
//     // ),
//   },
// ];

// const data: DataType[] = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//     tags: ['loser'],
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//     tags: ['cool', 'teacher'],
//   },
// ];

// const Tables: React.FC = () => <Table<DataType> columns={columns} dataSource={data} />;
// export default Tables;
import React from 'react';
import { Table, Tag, Space  , Tooltip} from 'antd';
import type { TableProps } from 'antd';

// Interface ko apne Supabase table ke columns ke mutabiq set karein
export interface DataType {
  id: string; // Supabase mein aksar 'id' hota hai
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'location',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'postType',
    key: 'postType',
    dataIndex: 'postType',
    // render: (tags: string[]) => (
    //   <>
    //     {tags?.map((tag) => (
    //       <Tag color="blue" key={tag}>
    //         {tag.toUpperCase()}
    //       </Tag>
    //     ))}
    //   </>
    // ),
  },
   {
    title: 'content',
    dataIndex: 'content',
    key: 'content',
     width: 200,
    ellipsis: true,
    render: (text) => (
      <Tooltip title={text}>
        <span>{text}</span>
      </Tooltip>
    ),
  },
   {
    title: 'reason',
    dataIndex: 'reason',
    key: 'reason',
     width: 200,
    ellipsis: true,
    render: (text) => (
      <Tooltip title={text}>
        <span>{text}</span>
      </Tooltip>
    ),
  },
   {
    title: 'linkedin',
    dataIndex: 'posts_link',
    key: 'posts_link',
     width: 200,
    ellipsis: true,
    render: (text) => (
      <Tooltip title={text}>
        <span>{text}</span>
      </Tooltip>
    ),
  },
];

interface TablesProps {
  dataSource: DataType[];
  loading: boolean;
}

const Tables: React.FC<TablesProps> = ({ dataSource, loading }) => {
  return (
    <Table 
      columns={columns} 
      dataSource={dataSource} 
      loading={loading} 
      rowKey="id" // Supabase ki unique ID use karein
    />
  );
};

export default Tables;