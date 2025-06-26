import React from "react";
import Link from "next/link";
import Image from "next/image";
// import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-grow">
        {/* Banner and Top-up Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex gap-4">
              {/* Banner - 2/3 width */}
              <div className="w-3/4">
                <Image
                  src="/images/banner.png"
                  alt="Shop banner"
                  width={1200}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Top-up Section - 1/3 width */}
              <div className="w-1/4 bg-[#003a8c] p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-center text-white">
                  Top nạp tiền
                </h3>
                <div className="space-y-3">
                  {/* Top user 1 */}
                  <div className="flex items-center justify-between bg-white/10 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400 font-bold">1</span>
                      <span className="text-white">Nguyễn Văn A</span>
                    </div>
                    <span className="text-green-400">5.000.000đ</span>
                  </div>

                  {/* Top user 2 */}
                  <div className="flex items-center justify-between bg-white/10 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300 font-bold">2</span>
                      <span className="text-white">Trần Thị B</span>
                    </div>
                    <span className="text-green-400">3.500.000đ</span>
                  </div>

                  {/* Top user 3 */}
                  <div className="flex items-center justify-between bg-white/10 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-600 font-bold">3</span>
                      <span className="text-white">Lê Văn C</span>
                    </div>
                    <span className="text-green-400">2.000.000đ</span>
                  </div>

                  {/* Top user 4 */}
                  <div className="flex items-center justify-between bg-white/10 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">4</span>
                      <span className="text-white">Phạm Thị D</span>
                    </div>
                    <span className="text-green-400">1.500.000đ</span>
                  </div>

                  {/* Top user 5 */}
                  <div className="flex items-center justify-between bg-white/10 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">5</span>
                      <span className="text-white">Hoàng Văn E</span>
                    </div>
                    <span className="text-green-400">1.000.000đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Options
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Phương thức nạp tiền
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link href="/chuyen-khoan" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Image
                    src="/images/napbank.jpg"
                    alt="Chuyển khoản"
                    width={200}
                    height={200}
                    className="w-full h-auto group-hover:scale-105 transition-transform"
                  />
                  <p className="text-center mt-4 font-medium">Chuyển khoản</p>
                </div>
              </Link>
              <Link href="/momo" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Image
                    src="/images/napmomo.jpg"
                    alt="Momo"
                    width={200}
                    height={200}
                    className="w-full h-auto group-hover:scale-105 transition-transform"
                  />
                  <p className="text-center mt-4 font-medium">Ví Momo</p>
                </div>
              </Link>
              <Link href="/the-cao" className="group">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Image
                    src="/images/napcard.jpg"
                    alt="Thẻ cào"
                    width={200}
                    height={200}
                    className="w-full h-auto group-hover:scale-105 transition-transform"
                  />
                  <p className="text-center mt-4 font-medium">Thẻ cào</p>
                </div>
              </Link>
            </div>
          </div>
        </section> */}

        {/* Price Categories - Moved to top */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Acc Tự Chọn
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-[180px] mb-3">
                  <Image
                    src="/images/nickgiare.gif"
                    alt="Nick Liên Quân Giá Rẻ"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-bold">Nick Liên Quân Giá Rẻ</h3>
                <p className="text-gray-600 text-sm">Đã bán: 12.9K</p>
                <Link href="/account/nickgiare">
                  <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Mua ngay
                  </button>
                </Link>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-[180px] mb-3">
                  <Image
                    src="/images/nickvip.png"
                    alt="Nick liên quân VIP"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-bold">Nick liên quân VIP</h3>
                <p className="text-gray-600 text-sm">Đã bán: 8.5K</p>
                <Link href="/account/nickvip">
                  <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Mua ngay
                  </button>
                </Link>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-[180px] mb-3">
                  <Image
                    src="/images/nickttx.jpg"
                    alt="Nick liên quân thông tin xấu"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-bold">
                  Nick liên quân thông tin xấu
                </h3>
                <p className="text-gray-600 text-sm">Đã bán: 5.2K</p>
                <Link href="/account/nickthongtinxau">
                  <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Mua ngay
                  </button>
                </Link>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-[180px] mb-3">
                  <Image
                    src="/images/nickfreefire.png"
                    alt="Free Fire"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-bold">Free Fire</h3>
                <p className="text-gray-600 text-sm">Đã bán: 3.1K</p>
                <Link href="/account/freefire">
                  <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Mua ngay
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* other Categories - Moved to top */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Dịch Vụ game
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-[180px] mb-3">
                  <Image
                    src="https://cellphones.com.vn/sforum/wp-content/uploads/2022/04/Screenshot_7-7.png"
                    alt="Cày thuê Liên Quân"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-bold">Cày thuê Liên Quân</h3>
                <p className="text-gray-600 text-sm">Đã bán: 12.9K</p>
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Thuê ngay
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-[180px] mb-3">
                  <Image
                    src="https://kenh14cdn.com/203336854389633024/2021/3/14/photo-1-16157134109511814216671.jpg"
                    alt="Cày thuê Tốc chiến"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-bold">Cày thuê Tốc chiến</h3>
                <p className="text-gray-600 text-sm">Đã bán: 8.5K</p>
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Thuê ngay
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-[180px] mb-3">
                  <Image
                    src="https://topchuyengia.vn/uploads/images/original_images/lam-sao-de-ban-acc-lien-quan-uy-tin-2021-3076.jpg"
                    alt="Thu mua acc liên quân"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-bold">
                  Thu mua acc liên quân
                </h3>
                <p className="text-gray-600 text-sm">Đã bán: 5.2K</p>
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Bán acc ngay
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
