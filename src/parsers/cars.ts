import { JSDOM } from "jsdom";

export type Car = {
  id: string;
  url: string;
  title: string;
}

export const getCars = async (): Promise<Car[]> => {
  const cars: Car[] = [];
  const page = await JSDOM.fromURL("https://www.ss.lv/lv/transport/other/transport-with-defects-or-after-crash");
  const entries = [...page.window.document.querySelectorAll("#filter_frm > table:nth-child(3) tr")];

  entries.forEach((entry) => {
    if (entry.querySelector("td:nth-child(2) a")) {
      const id = entry.getAttribute("id")!;
      const url = `https://www.ss.lv${entry.querySelector("td:nth-child(2) a")!.getAttribute("href")}`;
      const title = entry.querySelector("td:nth-child(3)")!.textContent!;
      const model = entry.querySelector("td:nth-child(4)")!.textContent!.toLowerCase();

      if (model && model.includes("volvo")) {
        cars.push({
          id,
          url,
          title,
        });
      }
    }
  });
  return cars;
};

export const formatCarResults = (cars: Car[]) => {
  return cars.map((Car) => `${Car.title}: ${Car.url}`);
}
