import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/supabase";
import Tables, { DataType } from "../../component/table";
import { Select, Space, Input } from "antd";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<"approved" | "unapproved">("approved");
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [searchCountry, setSearchCountry] = useState("");
  const [postType, setPostType] = useState("");
  const [approachFilter, setApproachFilter] = useState("");

  const table =
    active === "approved"
      ? "approved_region_person"
      : "unapprove_region_person";

  const { Search } = Input;

  // 🔥 Fetch Data Function
  const fetchData = async (
    tableName: string,
    country: string,
    type: string,
    approach: string
  ) => {
    setLoading(true);

    // const twentyFourHoursAgo = new Date(
    //   Date.now() - 24 * 60 * 60 * 1000
    // ).toISOString();

    let query = supabase
      .from(tableName)
      .select("*")
      // .gte("created_at", twentyFourHoursAgo)
      .order("created_at", { ascending: false });

    // 🔎 Country Filter
    if (country) {
      query = query.ilike("location", `%${country}%`);
    }

    // 🏷 Post Type Filter
    if (type) {
      query = query.eq("postType", type);
    }

    // 📞 Approach Filter
    if (approach === "APPROACHED") {
      query = query.eq("status_contacted", true);
    }

    if (approach === "NOT_APPROACHED") {
      query = query.eq("status_contacted", false);
    }

    const { data, error } = await query;

    if (!error && data) {
      setDataSource(data as DataType[]);
    } else if (error) {
      console.error("Error fetching data:", error.message);
    }

    setLoading(false);
  };

  // 🔁 Auto Fetch on Filter Change
  useEffect(() => {
    fetchData(table, searchCountry, postType, approachFilter);
  }, [active, searchCountry, postType, approachFilter]);

  // 🔘 Handle Table Switch
  const handleChange = (value: string) => {
    if (value === "approve") {
      setActive("approved");
    }
    if (value === "unapprove") {
      setActive("unapproved");
    }
  };

  // 📞 Approach Button Update
  const handleApproach = async (id: string) => {
    const { error } = await supabase
      .from(table)
      .update({ status_contacted: true })
      .eq("id", id);

    if (!error) {
      setDataSource((prev) =>
        prev.map((item) =>
          String(item.id) === String(id)
            ? { ...item, status_contacted: true }
            : item
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      
      {/* Heading */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl mt-4 text-black md:text-3xl font-bold tracking-wide">
          Linkedin Post Data
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Manage and view your linkedin post analytics
        </p>
      </div>

      <div className="w-full max-full rounded-xl shadow-xl border-gray-200 border-4">
        
        {/* Filters */}
        <div className="m-2 gap-4 flex justify-between items-center flex-wrap">
          <Space>
            <Search
              placeholder="Search Country"
              onSearch={(value) => setSearchCountry(value)}
              enterButton
              className="dashboard-search"
            />
          </Space>

          <div className="flex gap-3 flex-wrap">
            {/* Post Type */}
            <Select
              placeholder="Select Post Type"
              style={{ width: 160 }}
              allowClear
              onChange={(value) => setPostType(value || "")}
              options={[
                { value: "FREELANCE", label: "Freelance" },
                { value: "COMPANY", label: "Company" },
              ]}
            />

            {/* Approach Status */}
            <Select
              placeholder="Approach Status"
              style={{ width: 180 }}
              allowClear
              onChange={(value) => setApproachFilter(value || "")}
              options={[
                { value: "APPROACHED", label: "Approached" },
                { value: "NOT_APPROACHED", label: "Not Approached" },
              ]}
            />

            {/* Approved / Unapproved */}
            <Select
              defaultValue="approve"
              style={{ width: 140 }}
              onChange={handleChange}
              value={active === "approved" ? "approve" : "unapprove"}
              options={[
                { value: "approve", label: "Approved" },
                { value: "unapprove", label: "Unapproved" },
              ]}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-x-auto">
          <Tables
            dataSource={dataSource}
            loading={loading}
            onApproach={handleApproach}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
