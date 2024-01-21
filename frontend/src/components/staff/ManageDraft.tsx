import { Draft } from "../../types/Tournament";

type Props = {
  currentDraft: Draft;
};

const ManageDraft = ({ currentDraft }: Props) => {
  return <p>TODO: manage ongoing draft {currentDraft.id}</p>;
};

export default ManageDraft;
