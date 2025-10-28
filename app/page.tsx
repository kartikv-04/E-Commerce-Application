import Hello from "../components/hello"

const page = () => {
  console.log("What component am I?")
  return (
    <div>
      <Hello/>
      hello 
    </div>
  )
}

export default page