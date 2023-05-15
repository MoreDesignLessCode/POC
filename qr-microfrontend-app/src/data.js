const reviewsData = [
  {
    id: "1",
    rating: 5,
    title: "This is my favorite product",
    author: "Jane Doe",
    published: "2022-10-01",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt tortor aliquam nulla facilisi. Dignissim sodales ut eu sem integer. Eu scelerisque felis imperdiet proin fermentum leo vel. Vitae justo eget magna fermentum iaculis eu.",
    tags: ["test", "inactive", "beta"],
    response: {
      author: "Johnny Appleseed",
      published: "2022-10-02",
      response:
        "Thank you, Jane, for your thoughtful response. We appreciate you taking the time to let us know how much you love the product. Stay tuned for more great updates!",
    },
  },
  {
    id: "2",
    rating: 3,
    title: "Room for Improvement",
    author: "Foo Bar",
    published: "2022-09-01",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt tortor aliquam nulla facilisi. Dignissim sodales ut eu sem integer. Eu scelerisque felis imperdiet proin fermentum leo vel. Vitae justo eget magna fermentum iaculis eu.",
    tags: ["test", "active"],
    response: {
      author: "Johnny Appleseed",
      published: "2022-09-02",
      response:
        "Thank you, Foo, for your thoughtful response. We appreciate you taking the time to let us know how much you love the product. Stay tuned for more great updates!",
    },
  },
  {
    id: "3",
    rating: 5,
    title: "Almost Perfect",
    author: "Jim Dandy",
    published: "2022-07-21",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt tortor aliquam nulla facilisi. Dignissim sodales ut eu sem integer. Eu scelerisque felis imperdiet proin fermentum leo vel. Vitae justo eget magna fermentum iaculis eu.",
    tags: ["beta"],
    response: {
      author: "",
      published: "",
      response: "",
    },
  },
];

export default reviewsData;
