import { Draft } from "../../types/Tournament";

type Props = {
  currentDraft: Draft;
};

const ManageDraft = ({ currentDraft }: Props) => {
  return <p>TODO: manage draft {currentDraft.id}</p>;
};

export default ManageDraft;
