import "./MasterHeader.css";

type Props = {
  title: string;
  buttonText: string;
  onAdd?: () => void;
};

export default function MasterHeader({
  title,
  buttonText,
  onAdd,
}: Props) {
  return (
    <div className="master-header">

      <h1>{title}</h1>

      <button
        className="master-add-btn"
        onClick={onAdd}
      >
        {buttonText}
      </button>

    </div>
  );
}