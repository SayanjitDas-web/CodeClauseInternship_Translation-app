import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = () => {
    const data = {
      email,
      password,
    };
    axios
      .post(`${import.meta.env.VITE_BACKEND_URI}/login`, data)
      .then((response) => {
        if (response.data.success) {
          navigate(
            `/translator/${response.data.data.username}/${response.data.data._id}/${response.data.data.wordlimit}`
          );
        }
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
            <CardTitle>Login User</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
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
            <Button className="mb-2" onClick={login}>
              Login
            </Button>
            <p>
              Don't have account?
              <Link className=" font-semibold pl-2 underline" to="/">
                Register
              </Link>
            </p>
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

export default Login;
