import AddUser from "../../components/AddUser";
import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "../../components/ui/sheet";
import { columns, type User } from "./columns";
import { useSidebar } from "../../components/ui/sidebar";

const getData = (): User[] => {
  return [
    {
      id: "1",
      name: "João Silva",
      username: "joaosilva",
      email: "joao.silva@example.com",
    },
    {
      id: "2",
      name: "Maria Oliveira",
      username: "mariaoliveira",
      email: "maria.oliveira@example.com",
    },
    {
      id: "3",
      name: "Carlos Souza",
      username: "carlossouza",
      email: "carlos.souza@example.com",
    },
    {
      id: "4",
      name: "Ana Pereira",
      username: "anapereira",
      email: "ana.pereira@example.com",
    },
  ];
};

const UsersPage = () => {
  const data = getData();
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <div
      className={`bg-white min-h-screen p-6 transition-all duration-300 ${
        isCollapsed ? "ml-3" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-white rounded-md w-64 border border-gray-200 shadow-sm">
          <h1 className="font-semibold">Gerenciamento de Usuários</h1>
        </div>

        <Sheet>
          <SheetTrigger asChild></SheetTrigger>
          <div className="rounded-md bg-[#457B9D]  text-white">
            <AddUser />
          </div>
        </Sheet>
      </div>

      <div className="border border-black-200 rounded-lg bg-white overflow-hidden">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default UsersPage;
