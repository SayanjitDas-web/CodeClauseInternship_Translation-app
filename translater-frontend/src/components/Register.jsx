import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Heart, Languages } from "lucide-react";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const register = () => {
    const data = {
      username,
      email,
      password,
    };
    axios
      .post(`${import.meta.env.VITE_BACKEND_URI}/register`, data)
      .then((response) => {
        if (response.data.success) {
          setIsSuccess(true);
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        console.error("Error :", err);
      });
  };

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-[10%] flex-col justify-center items-center select-none">
        <h1 className="text-center text-5xl font-thin flex justify-center items-center py-2">
          <Languages size="50px" />
          Translatify
        </h1>
        <p className="text-center text-slate-700">
          best translator tool for you!
        </p>
      </div>
      <div className="w-screen h-4/5 flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Register User</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    placeholder="enter username.."
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    placeholder="enter email.."
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    value={password}
                    placeholder="enter password.."
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col justify-center items-center">
            <Button className="mb-2" onClick={register}>
              Register
            </Button>
            <p>
              Already have account?
              <Link className=" font-semibold pl-2 underline" to="/login">
                Login
              </Link>
            </p>
            {isSuccess ? (
              <h1 className="text-center text-2xl">
                User registered successfull 🎉
              </h1>
            ) : (
              ""
            )}
          </CardFooter>
        </Card>
      </div>
      <div className="w-full h-[10%] flex-col justify-center items-center">
        <h1 className="text-center flex justify-center items-center">
          Made with
          <Heart className="mx-1" fill="red" />
          by{" "}
          <Link
            to="https://www.linkedin.com/in/sayanjit-das-99734328b/"
            className="ml-1 font-semibold"
          >
            Sayanjit Das
          </Link>
        </h1>
      </div>
    </div>
  );
}

export default Register;
