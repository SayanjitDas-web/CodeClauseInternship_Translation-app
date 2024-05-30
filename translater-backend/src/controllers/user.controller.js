import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User created SuccessFully!!"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ email }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      isLoggedIn: true,
    }
  );

  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, loggedInUser, "User loggedIn SuccessFully!!"));
});

const logout = asyncHandler(async (req, res) => {
  const { username, id } = req.body;

  if ([username, id].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ username, _id: id }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  await User.findOneAndUpdate(
    {
      _id: id,
    },
    {
      isLoggedIn: false,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logout SuccessFully!!"));
});

const translate = asyncHandler(async (req, res) => {
  const { username, id, text, targetLang } = req.body;

  if ([username, id, text, targetLang].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ _id: id, username }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  if (!user.isLoggedIn) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { isLoggedIn: user.isLoggedIn },
          "user need to loggedIn!!"
        )
      );
  }

  const url =
    "https://google-translate113.p.rapidapi.com/api/v1/translator/text";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": process.env.TRANSLATE_API_KEY,
      "X-RapidAPI-Host": "google-translate113.p.rapidapi.com",
    },
    body: new URLSearchParams({
      from: "auto",
      to: targetLang,
      text,
    }),
  };

  try {
    if (user.wordlimit > 5) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { wordlimit: "maxed reached" },
            "word limit reached max!! wait for next day"
          )
        );
    }
    const response = await fetch(url, options);
    const result = await response.text();
    const jsonRes = JSON.parse(result);
    const updatedWordlimitUser = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        wordlimit: user.wordlimit + 1,
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { wordlimit: updatedWordlimitUser.wordlimit, jsonRes },
          "Translated SuccessFully!!"
        )
      );
  } catch (error) {
    console.error(error);
  }
});

const supportedLang = asyncHandler(async (req, res) => {
  const url =
    "https://google-translate113.p.rapidapi.com/api/v1/translator/support-languages";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.TRANSLATE_API_KEY,
      "X-RapidAPI-Host": "google-translate113.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    const jsonRes = JSON.parse(result);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
         jsonRes ,
          "SuccessFull!!"
        )
      );
  } catch (error) {
    console.error(error);
  }
});

export { registerUser, loginUser, translate, logout, supportedLang };
