import StaffChat from "../../components/StaffChat";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";

export default function StaffChatPage() {
    return (
        <div className="flex">
            <SidebarAdmin />
            <div className="flex-1">
                <HeaderAdmin title="Chat với khách hàng" />
                <div className="p-6">
                    <StaffChat />
                </div>
            </div>
        </div>
    );
}
