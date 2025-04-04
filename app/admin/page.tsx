import { IoLockOpenSharp } from "react-icons/io5";

const AdminPage = () => {
  return (
    <div className="flex items-center justify-center gap-2 min-h-[70vh] flex-col  w-full text-center ">
      <p>This is only accessible to the admin</p>
      <IoLockOpenSharp />
      <p>(You&apos;re the admin.)</p>
    </div>
  );
};

export default AdminPage;
