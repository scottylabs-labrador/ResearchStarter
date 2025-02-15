const Spinner = (loading) => {
  const override = {
    display: "block",
    margin: "100px auto",
  };

  return (
    <svg
      className="block animate-spin h-10 w-10 mr-3 ..."
      viewBox="0 0 24 24"
    ></svg>
  );
};

export default Spinner;
