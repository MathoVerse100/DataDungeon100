import Layout from "./layout";

export default function App() {
  return (
    <Layout mainBodyLimited={false} hideInnerSidebar={true}>
      <Layout.Main>
        <h1 className="text-yellow-500 font-bold">
          Some home inner sidebar buttons
        </h1>
      </Layout.Main>
    </Layout>
  );
}
