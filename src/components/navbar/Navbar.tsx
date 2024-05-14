import getCurrentUser from "@/libs/getCurrentUser"
import Container from "../Container"
import Logo from "./Logo"
import Search from "./Search"
import UserMenu from "./UserMenu"
import Categories from "./Categories"




const Navbar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Logo />

            <Search />

            <UserMenu currentUser={currentUser} />
          </div>
        </Container>

      </div>

      <Categories />
    </div>
  )
}

export default Navbar