export type SetStateBool = React.Dispatch<React.SetStateAction<boolean>>

const useModalOpen = () => {
    return (setOpen: SetStateBool, overflow: string, open:boolean) => {
        const body = document.querySelector("body");
        if (body) body.style.overflow = overflow;
        setOpen(open);
    }
}

export default useModalOpen
