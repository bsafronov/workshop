export const JsonBeautify = ({ data }: { data: unknown }) => {
  return <pre>{JSON.stringify(data, null, "\t")}</pre>;
};
