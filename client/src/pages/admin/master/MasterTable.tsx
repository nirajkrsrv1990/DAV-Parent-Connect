import "./MasterTable.css";

type Props = {
  headers: string[];
  children: React.ReactNode;
};

export default function MasterTable({
  headers,
  children,
}: Props) {
  return (
    <div className="master-table-wrapper">

      <table className="master-table">

        <thead>

          <tr>

            {headers.map((item) => (
              <th key={item}>{item}</th>
            ))}

          </tr>

        </thead>

        <tbody>

          {children}

        </tbody>

      </table>

    </div>
  );
}