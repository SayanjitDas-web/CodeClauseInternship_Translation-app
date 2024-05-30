import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Heart, Languages } from "lucide-react";

function Translator() {
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [inputText, setInputText] = useState("");
  const [dailyLimit, setDailyLimit] = useState(null);
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const { username, id, limit } = useParams();

  const handleChange = (value) => {
    setSelectedLanguage(value);
  };

  const handleTranslate = () => {
    const data = {
      username,
      id,
      text: inputText,
      targetLang: selectedLanguage,
    };
    axios
      .post(`${import.meta.env.VITE_BACKEND_URI}/translate`, data)
      .then((response) => {
        if (response.data.success) {
          setTranslatedText(response.data.data.jsonRes.trans);
          setDailyLimit(response.data.data.wordlimit)
          console.log(response.data)
        }
      })
      .catch((err) => {
        console.error("Error :", err);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios({
      baseURL: `${import.meta.env.VITE_BACKEND_URI}`,
      url: "/suportedlang",
      method: "get",
    })
      .then((response) => {
        setSupportedLanguages(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching supported languages:", err);
        // You might want to show an error message to the user
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-screen h-screen">
      <div className="w-screen h-[30%] pt-10">
      <div className="w-full flex-col justify-between items-center select-none mb-8">
        <h1 className="text-center text-5xl font-thin flex justify-center items-center py-1">
          <Languages size="50px" />
          Translatify
        </h1>
        <p className="text-center text-slate-700">
          best translator tool for you!
        </p>
      </div>
        <h1 className="text-center text-2xl">
          👋hello, <span className="text-3xl font-semibold">{username} !</span>
        </h1>
        <p className="text-center text-xl pt-2">
          your daily limit: <span>{dailyLimit ? dailyLimit : limit}/5</span>
        </p>
      </div>
      <div className="w-screen h-[60%] flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-center">Translate</CardTitle>
            <CardDescription className="text-center">
              Best translator tool for you!!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder="enter text for translate.."
              className="w-full h-24 border-2 rounded-xl overflow-x-hidden overflow-y-auto p-1"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Select onValueChange={handleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    supportedLanguages.map((lang, i) => (
                      <SelectItem key={i} value={lang.code}>
                        {lang.language}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <textarea
              className="w-full h-24 border-2 rounded-xl overflow-x-hidden overflow-y-auto mt-2 p-1"
              value={translatedText}
              readOnly
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleTranslate}>Translate</Button>
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

export default Translator;
