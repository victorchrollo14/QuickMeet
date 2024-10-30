import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import headerSVG from "../assets/images/header.svg";
import mobileSVG from "../assets/images/mobile.svg";
import desktop from "../assets/images/desktop.svg";
import privacySVG from "../assets/images/privacy.svg";
import transparencySVG from "../assets/images/transparency.svg";
import easySVG from "../assets/images/easy.svg";
import welcomeSVG from "../assets/images/welcome.svg";
import CreateMeeting from "../components/CreateMeeting";
import { ChangeEvent, useState } from "react";
//display error message if the server is down
function Index() {
  const [meetingURL, setMeetingURL] = useState<string | undefined>("/")

  function handelChange(e: ChangeEvent<HTMLInputElement>) {
    let url;
    console.log(e)
    if (e.target.value.startsWith("http://")) {
      url = e.target.value
    } else {
      url = "http://localhost:5173/meet/" + e.target.value
    }

    setMeetingURL(url)
  }

  return (
    <div className="bg-white">
      <section className=" header  overflow-hidden ">
        <Navbar />

        <div className="container pt-[30px] tablet:pt-[60px] ">
          <div className="flex justify-between mobile:flex-wrap ">
            <div className="left max-w-[432px] tablet:max-w-[330px] mobile:pb-[30px]">
              <h1 className="text-black ">
                Join or start a conference call with just one click
              </h1>
              <p className=" opacity-[0.8] text-black ">
                no need to create an account just drop the link and join a
                meeting or create new one instantly and your information won’t
                be saved.
              </p>
              <div className="flex tablet:flex-wrap tablet:items-start items-center mt-[70px] tablet:mt-[50px] gap-[30px] tablet:gap-[15px]">
                <CreateMeeting />

                <div className="tablet:flex tablet:gap-[15px] tablet:items-center ">
                  <input
                    type="text"
                    onChange={(e) => { handelChange(e) }}
                    className="border-2   text-[14px] tablet:text-[12px] tablet:px-[10px] px-[18px] py-[11px] bg-white text-black rounded-md"
                    placeholder="Enter Link"
                  />
                  <a href={meetingURL} className="text-light-grey tablet:text-[12px] ">
                    Join
                  </a>
                </div>
              </div>
            </div>
            <div className="right -mr-[140px] tablet:-mr-[30px] ">
              <img src={headerSVG} className="" />
            </div>
          </div>
        </div>
      </section>
      <section className="first text-center overflow-hidden pb-20 pt-40">
        <div className="container ">
          <h1 className="text-black">Compatible With Any Device</h1>
          <div className="flex justify-between mt-20">
            <div className="left text-left">
              <p className="pl-[50px] mobile:pl-1">Mobile </p>
              <img src={mobileSVG} />
            </div>
            <div className="right -mr-[300px] tablet:-mr-[150px] mobile:-mr-[50px] text-left ">
              <p className="pl-[180px] mobile:pl-10 ">Desktop</p>
              <img src={desktop} />
            </div>
          </div>
        </div>
      </section>
      <section className="second py-20">
        <div className="container flex mobile:flex-wrap  justify-between items-center  ">
          <div className="right  -ml-[140px] tablet:-ml-[30px] mobile:-ml-[0px]   ">
            <img src={privacySVG} />
          </div>
          <div className="left max-w-[525px]  tablet:max-w-[400px] pl-[30px] mobile:pt-10  mobile:pl-0">
            <h1 className="text-black">
              <span className="text-green">privacy</span> <br />
              No data is being saved
            </h1>
            <p>
              trying to find a app that actually values your privacy and not
              sell your information behind your back? no problem. if you don’t
              register nothing will be saved to our databases, yes nothing. no
              messages no video no files!
            </p>
          </div>
        </div>
      </section>
      <section className="third py-20">
        <div className="container flex mobile:flex-wrap mobile:flex-col-reverse  justify-between items-center mobile:items-start ">
          <div className="left max-w-[525px] tablet:pr-[30px] mobile:pt-10 tablet:max-w-[400px] ">
            <h1 className="text-black ">
              <span className="text-green">Transparency & care</span>
              <br />
              we are completely open source
            </h1>
            <p>
              ever had that feeling where you really like the app but it’s
              missing one feature that you absolutely need? the project is
              completely open source witch means you can see what we are doing
              behind the curtains. and if you want a feature you can request it.
            </p>
          </div>
          <div className="right -mr-[140px]  tablet:-mr-[30px] mobile:-mr-0">
            <img src={transparencySVG} />
          </div>
        </div>
      </section>
      <section className="forth py-20">
        <div className="container flex mobile:flex-wrap  justify-between items-center mobile:items-left ">
          <div className="right -ml-[140px] tablet:-ml-[30px] mobile:-ml-0">
            <img src={easySVG} />
          </div>
          <div className="left max-w-[525px] tablet:max-w-[400px] tablet:pl-[30px] mobile:pt-10 mobile:pl-0 ">
            <h1 className="text-black">
              <span className="text-green">Fast & Easy</span>
              <br />
              One click setup
            </h1>
            <p>
              tiered of all the long forms and applications asking you for your
              credit card? no problem. You don’t even have to register. just
              drop the link and join a call, or create new one right now.
            </p>
          </div>
        </div>
      </section>
      <section className="fifth py-20">
        <div className="container flex mobile:flex-wrap justify-between items-center gap-[30px] text-center">
          <div className="left max-w-[525px] ">
            <h1 className="text-black">Get started right now </h1>
            <div className="mt-[80px] mobile:flex mobile:flex-wrap tablet:mt-[30px] mobile:gap-[10px] justify-around">
              <button className="bg-green text-white tablet:px-[50px] px-[54px] py-[11px] mr-[40px] mobile:mr-0 tablet:mb-[15px] mobile:mb-0">
                Register
              </button>
              <button className="bg-transparent  border-2 tablet:px-[30px] px-[45px] mobile:mr-0 py-[11px] border-green text-green">
                New Meeting
              </button>
            </div>
          </div>
          <div className="right -mr-[140px] tablet:-mr-[30px]  ">
            <img src={welcomeSVG} />
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
}
export default Index;
