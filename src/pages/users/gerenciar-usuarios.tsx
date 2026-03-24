import { useEffect, useState } from "react";
import AddUser from "../../components/AddUser";
import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "../../components/ui/sheet";
import { columns} from "./columns";
import { useSidebar } from "../../components/ui/sidebar";
import type { User } from "../../model/User";

const UsersPage = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8000/api/v1/usuarios/");

      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("Não foi possível carregar os usuários");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
          <SheetTrigger asChild>
            <div className="rounded-md bg-[#457B9D] text-white cursor-pointer">
              <AddUser onUserCreated={fetchUsers}/>
            </div>
          </SheetTrigger>
        </Sheet>
      </div>

      <div className="border border-black-200 rounded-lg bg-white overflow-hidden">
        {loading ? (
          <div className="p-4">Carregando usuários...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </div>
    </div>
  );
};

export default UsersPage;