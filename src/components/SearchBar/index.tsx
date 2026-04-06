import { useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import styles from "./searchBar.module.css";

export function SearchBar() {
  const coinValue = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function searchCoin(e: React.SubmitEvent) {
    e.preventDefault();
    const value = coinValue.current?.value;

    if (value?.trim() === "" || !value) {
      toast.error("Type a valid coin!");
      return;
    }

    navigate(`/crypto/${value.toLowerCase()}`, { replace: true });
  }

  return (
    <form className={styles.searchBox} onSubmit={searchCoin}>
      <input
        type="text"
        placeholder="Type the cryptocurrency"
        ref={coinValue}
      />
      <button type="submit" aria-label="search button">
        Search
      </button>
    </form>
  );
}
