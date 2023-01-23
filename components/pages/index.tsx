import Link from 'next/link'

const Page = () => {
  const pageList = ['sort', 'editor']
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      {pageList.map((listItem) => (
        <Link key={listItem} href={`/${listItem}`}>
          {listItem}
        </Link>
      ))}
    </div>
  )
}

export default Page
