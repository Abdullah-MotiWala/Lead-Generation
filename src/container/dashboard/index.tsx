import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/supabase";
import Tables, { DataType } from "../../component/table";
import { Select, Space } from 'antd';
import { Input, GetProps } from 'antd';
type SearchProps = GetProps<typeof Input.Search>;

const Dashboard = () => {
  const [posts, setPosts] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<"approved" | "unapproved">("approved");
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [searchCountry, setSearchCountry] = useState("");
  const [postType, setPostType] = useState("");
  const table = active === "approved" ? "approved_region_person" : "unapprove_region_person";
  const onSearch = (value: string) => {
    setSearchCountry(value);
  };

  const { Search } = Input;

 const fetchData = async (tableName: string, country: string, type: string) => {
    setLoading(true);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    let query = supabase
      .from(tableName)
      .select("*")
      // 2. Filter: created_at column ki value twentyFourHoursAgo se bari honi chahiye (gte = Greater Than or Equal)
      .gte("created_at", twentyFourHoursAgo) 
      // 3. Sorting: Latest rows sabse upar dikhane ke liye
      .order("created_at", { ascending: false });

    if (country) {
      query = query.ilike("location", `%${country}%`);
    }

    if (type) {
      query = query.ilike("postType", `%${type}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      setDataSource(data as DataType[]);
      console.log("data:", data);

    } else if (error) {
      console.error("Error fetching data:", error.message);
    }
    setLoading(false);
  };
const handleApproach = async (id: string ) => {
  const { error } = await supabase
    .from(table) // 'table' variable aapke state mein pehle se hai
    .update({ status_contacted: true })
    .eq('id', id);

  if (!error) {
    setDataSource(prev => 
      prev.map(item => String(item.id) === String(id) ? { ...item, status_contacted: true } : item)
    );
  }
};

  useEffect(() => {
    fetchData(table, searchCountry, postType);
  }, [active, searchCountry, postType]);


  const handleChange = (value: string) => {
    if (value === "approve") {
      setActive("approved");
      fetchData("approved_region_person", searchCountry, postType);
    }

    if (value === "unapprove") {
      setActive("unapproved");
      fetchData("unapprove_region_person", searchCountry, postType);
    }
  };



  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* Heading */}
      <div className="mb-6 text-center ">
        <h1 className="text-2xl mt-4 text-black md:text-3xl font-bold tracking-wide">
          Linkedin Post Data
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Manage and view your linkedin post analytics
        </p>
      </div>
      <div className="w-full max-full rounded-xl shadow-xl border-gray-200 border-4">

        <div className="m-2 gap-4 flex justify-between items-center">
          <Space>
            <Search
              placeholder="Search Country"
              onSearch={onSearch}
              enterButton
              className="dashboard-search "
            />
          </Space>
          <div>
            <Select
              placeholder="Select Post Type"
              style={{ width: 160 }}
              allowClear
              onChange={(value) => setPostType(value || "")}
              options={[
                { value: 'FREELANCE', label: 'Freelance' },
                { value: 'COMPANY', label: 'Company' },

              ]}
            />
            <Select
              defaultValue="approve"
              style={{ width: 140 }}
              onChange={handleChange}
              value={active === "approved" ? "approve" : "unapprove"}
              options={[
                { value: 'approve', label: 'Approved' },
                { value: 'unapprove', label: 'Unapproved' },
              ]}
            />
          </div>

        </div>



        {/* Table Container */}
        <div className="bg-white rounded-lg overflow-x-auto">
          <Tables dataSource={dataSource} loading={loading} onApproach={handleApproach}/>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
