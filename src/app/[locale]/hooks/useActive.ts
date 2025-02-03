const useActive = () => {
  return (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    lists: React.RefObject<HTMLDivElement>
  ) => {
    lists.current?.childNodes.forEach((list) => {
      if (!(list instanceof Element)) return;
      if (list.classList.contains("active")) {
        list.classList.remove("active");
      }
    });
    e.currentTarget.classList.add("active");
  };
};

export default useActive;
